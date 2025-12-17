import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ctx = await esbuild.context({
  entryPoints: [path.resolve(__dirname, "src/index.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outdir: path.resolve(__dirname, "dist"),
  sourcemap: true,
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  external: ["express", "axios", "http-proxy"],
});

if (process.argv.includes("--watch")) {
  await ctx.watch();
  console.log("👀 esbuild watch запущен");
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log(`✅ Билд ${process.env.nameService ?? ""} готов`);
}
