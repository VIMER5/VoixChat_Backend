export interface serviceInfoProto {
  nameService: string;
  portService: number;
}

export interface serviceInfo extends serviceInfoProto {
  ipService: string;
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
