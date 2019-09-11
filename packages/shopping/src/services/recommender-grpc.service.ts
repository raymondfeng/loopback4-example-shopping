import {getService} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import {RecommanderGrpcDataSource} from '../datasources';
import {Product} from '../models';

export interface RecommenderGrpc {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  recommend(req: {userId: string}): Promise<{products: Product[]}>;
}

export class RecommenderGrpcProvider implements Provider<RecommenderGrpc> {
  constructor(
    // recommender must match the name property in the datasource json file
    @inject('datasources.recommander_grpc')
    protected dataSource: RecommanderGrpcDataSource = new RecommanderGrpcDataSource(),
  ) {}

  value(): Promise<RecommenderGrpc> {
    return getService(this.dataSource);
  }
}
