import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class grpcClient {
  private recipesProto: any;
  client: any;

  constructor(protoName: string, packageProto: string, serviceName: string, connectUrl: string) {
    const packageDefinitionReci = protoLoader.loadSync(path.join(process.cwd(), "proto", protoName));
    this.recipesProto = grpc.loadPackageDefinition(packageDefinitionReci) as any;
    this.client = new this.recipesProto[packageProto][serviceName](connectUrl, grpc.credentials.createInsecure());
  }
}

export default grpcClient;
