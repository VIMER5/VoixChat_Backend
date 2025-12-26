import { serviceInfo, ServiceInstance } from "model/protoType.js";
import { randomUUID } from "crypto";
class cacheDiscovery {
  private ttl: number;
  private cache = new Map<string, cacheInstances[]>();
  constructor(ttl: number) {
    this.ttl = ttl;
    this.checkttl();
  }
  async addInstance(instance: serviceInfo) {
    const thisinstance: cacheInstances = {
      ttl: Date.now() + this.ttl,
      id: randomUUID(),
      ...instance,
    };
    if (!this.cache.has(instance.nameService)) {
      this.cache.set(instance.nameService, [thisinstance]);
      console.log(`Создан новый сервис ${instance.nameService}`);
      return;
    }
    const instances = this.cache.get(instance.nameService)!;
    const instanceIndex = instances.findIndex(
      (item) => item.ipService === instance.ipService && item.portService === instance.portService
    );
    if (instanceIndex != -1) {
      instances[instanceIndex].ttl = Date.now() + this.ttl;
    } else {
      console.log(`Добавлен новый инстанс сервиса ${instance.nameService}`);
      instances.push(thisinstance);
    }
  }
  async upInstance(instance: serviceInfo) {
    if (!this.cache.has(instance.nameService)) return this.addInstance(instance);
    const instances = this.cache.get(instance.nameService)!;
    const instanceIndex = instances.findIndex(
      (item) => item.ipService === instance.ipService && item.portService === instance.portService
    );
    if (instanceIndex != -1) {
      instances[instanceIndex].ttl = Date.now() + this.ttl;
    } else return this.addInstance(instance);
  }
  async getInstances(serviceName: string): Promise<ServiceInstance[] | []> {
    return this.cache.get(serviceName) ?? [];
  }
  checkttl() {
    setInterval(() => {
      for (const [serviceName, instances] of this.cache) {
        let removedCount = 0;
        const activeInstances = instances.filter((instance) => instance.ttl > Date.now());
        if (activeInstances.length === 0) {
          this.cache.delete(serviceName);
          console.log(`Удален сервис: ${serviceName}`);
        } else if (activeInstances.length < instances.length) {
          this.cache.set(serviceName, activeInstances);
          removedCount += instances.length - activeInstances.length;
          console.log(`Удалено ${removedCount} инстансов из ${serviceName}`);
        }
      }
    }, 10000);
  }
}
interface cacheInstances extends ServiceInstance {
  ttl: number;
}
export default new cacheDiscovery(10000);
