class cacheDiscovery {
  private ttl: number;
  private cache = new Map<string, cacheInstances[]>();
  constructor(ttl: number) {
    this.ttl = ttl;
    this.checkttl();
  }
  async addInstance(instance: Instance) {
    const thisinstance: cacheInstances = {
      ttl: Date.now() + this.ttl,
      name: instance.name,
      ip: instance.ip,
      port: instance.port,
    };
    if (!this.cache.has(instance.name)) {
      this.cache.set(instance.name, [thisinstance]);
      console.log(`Создан новый сервис ${instance.name}`);
      return;
    }
    const instances = this.cache.get(instance.name)!;
    const instanceIndex = instances.findIndex((item) => item.ip === instance.ip && item.port === instance.port);
    if (instanceIndex != -1) {
      instances[instanceIndex].ttl = Date.now() + this.ttl;
    } else {
      console.log(`Добавлен новый инстанс сервиса ${instance.name}`);
      instances.push(thisinstance);
    }
  }
  async upInstance(instance: Instance) {
    if (!this.cache.has(instance.name)) return this.addInstance(instance);
    const instances = this.cache.get(instance.name)!;
    const instanceIndex = instances.findIndex((item) => item.ip === instance.ip && item.port === instance.port);
    if (instanceIndex != -1) {
      instances[instanceIndex].ttl = Date.now() + this.ttl;
    } else {
      return this.addInstance(instance);
    }
  }
  async getInstances(serviceName: string) {
    return this.cache.get(serviceName);
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
interface Instance {
  name: string;
  ip: string;
  port: string | number;
}
interface cacheInstances extends Instance {
  ttl: number;
}
export default new cacheDiscovery(10000);
