import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

build({
  entryPoints: [path.resolve(__dirname, "src/index.ts")],
  bundle: true,
  platform: "node",
  target: ["node20"],
  format: "esm",
  outdir: path.resolve(__dirname, "dist"),
  sourcemap: false,
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  external: ["express", "axios", "http-proxy"],
})
  .then(() => {
    console.log(`✅ Билд ${process.env.nameService} готов`);
  })
  .catch(() => process.exit(1));
