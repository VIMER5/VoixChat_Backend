export interface serviceInfo {
  nameService: string;
  ipService: string;
  portService: number;
}

export interface infoResponse {
  success: boolean;
  message: string;
}

export interface ServiceInstance extends serviceInfo {
  id: string;
}
export interface servicesNameRequest {
  nameService: string;
}
export interface ListServiceInstancesResponse {
  success: boolean;
  Instances: ServiceInstance[] | [];
}
