import grpcClientd from "module/grpcClient/index.js";
import gRPC from "./gRPC.js";

await isValidENV();
// gRPC.start();
let ff = new grpcClientd("discovery.proto");

async function isValidENV() {
  let errorEnv: string[] = [];
  const { nameService = null, portService = null, cacheTTL = null, checkingCacheTTL = null } = process.env;
  if (!nameService) errorEnv.push("Укажите nameService в env");
  if (!portService) errorEnv.push("Укажите portService в env");
  const cacheTTLNum = cacheTTL ? Number(cacheTTL) : NaN;
  if (isNaN(cacheTTLNum)) errorEnv.push("Укажите cacheTTL в env как число");
  const checkingCacheTTLNum = checkingCacheTTL ? Number(checkingCacheTTL) : NaN;
  if (isNaN(checkingCacheTTLNum)) errorEnv.push("Укажите checkingCacheTTL в env как число");
  if (errorEnv.length != 0) {
    for (let item of errorEnv) {
      console.log(item);
    }
    process.exit();
  }
}
