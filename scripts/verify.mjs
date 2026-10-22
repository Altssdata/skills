import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const packageRoot = new URL("../", import.meta.url);
const canonicalUrl = "https://altss.com/skills/altss-public-research/SKILL.md";
const skillPath = "skills/altss-public-research/SKILL.md";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function main() {
  const args = process.argv.slice(2);
  assert(args.length === 0 || (args.length === 1 && args[0] === "--live"), "Usage: node scripts/verify.mjs [--live]");

  const provenance = JSON.parse(await readFile(new URL("provenance.json", packageRoot), "utf8"));
  assert.equal(provenance.schemaVersion, 1, "Unsupported provenance schema");
  assert.equal(provenance.skill, "altss-public-research");
  assert.equal(provenance.artifact.path, skillPath, "Unexpected artifact path");
  assert.equal(provenance.artifact.sourceUrl, canonicalUrl, "Unexpected canonical source");
  assert.match(provenance.artifact.sha256, /^[a-f0-9]{64}$/, "Invalid SHA-256 digest");
  assert(Number.isSafeInteger(provenance.artifact.bytes) && provenance.artifact.bytes > 0, "Invalid byte count");

  const bytes = await readFile(new URL(skillPath, packageRoot));
  assert.equal(bytes.length, provenance.artifact.bytes, "Artifact byte count differs from provenance");
  assert.equal(sha256(bytes), provenance.artifact.sha256, "Artifact SHA-256 differs from provenance");
  const markdown = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert(frontmatter, "Missing YAML frontmatter");
  assert.match(frontmatter[1], /^name: altss-public-research$/m, "Unexpected skill name");
  assert.match(frontmatter[1], /^description: \S.+$/m, "Missing skill description");

  const result = { ok: true, skill: provenance.skill, bytes: bytes.length, sha256: sha256(bytes), canonicalMatch: "not-requested" };
  if (args[0] === "--live") {
    const response = await fetch(canonicalUrl, { redirect: "error", signal: AbortSignal.timeout(10000), headers: { Accept: "text/markdown" } });
    assert.equal(response.status, 200, `Canonical artifact returned HTTP ${response.status}`);
    const published = Buffer.from(await response.arrayBuffer());
    assert(bytes.equals(published), `Canonical bytes differ: published sha256:${sha256(published)}; review the public revision before updating`);
    result.canonicalMatch = true;
  }
  const additional = JSON.parse(await readFile(new URL("additional-provenance.json", packageRoot), "utf8"));
  assert.equal(additional.schemaVersion, 1, "Unsupported additional provenance schema");
  assert.deepEqual(additional.publisher, { name: "Altss", website: "https://altss.com" });
  assert.deepEqual(additional.artifacts.map(artifact => artifact.name), ["altss-profile-verification", "altss-listing-preparation"], "Unexpected focused skill inventory");
  result.additionalSkills = [];
  for (const artifact of additional.artifacts) {
    const expectedPath = `skills/${artifact.name}/SKILL.md`;
    assert.equal(artifact.path, expectedPath, "Unexpected focused artifact path");
    assert.equal(artifact.sourceUrl, `https://altss.com/${expectedPath}`, "Unexpected focused canonical URL");
    const content = await readFile(new URL(expectedPath, packageRoot));
    assert.equal(content.length, artifact.bytes, "Focused artifact byte count differs");
    assert.match(artifact.sha256, /^[a-f0-9]{64}$/);
    assert.equal(sha256(content), artifact.sha256, "Focused artifact digest differs");
    const text = new TextDecoder("utf-8", { fatal: true }).decode(content);
    assert(text.startsWith(`---\nname: ${artifact.name}\ndescription: `), "Focused artifact frontmatter differs");
    let canonicalMatch = "not-requested";
    if (args[0] === "--live") {
      const response = await fetch(artifact.sourceUrl, { redirect: "error", signal: AbortSignal.timeout(10000), headers: { Accept: "text/markdown" } });
      assert.equal(response.status, 200, `${artifact.name} canonical returned HTTP ${response.status}`);
      assert(content.equals(Buffer.from(await response.arrayBuffer())), `${artifact.name} differs from its canonical bytes`);
      canonicalMatch = true;
    }
    result.additionalSkills.push({ name: artifact.name, bytes: content.length, sha256: sha256(content), canonicalMatch });
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`Skill verification failed: ${error.message}\n`);
  process.exitCode = 1;
});
