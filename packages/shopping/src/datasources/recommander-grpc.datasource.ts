import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './recommander-grpc.datasource.json';
import * as path from 'path';

export class RecommanderGrpcDataSource extends juggler.DataSource {
  static dataSourceName = 'recommander_grpc';

  constructor(
    @inject('datasources.config.recommander_grpc', {optional: true})
    dsConfig: object = config,
  ) {
    super({...dsConfig, spec: RecommanderGrpcDataSource.getProtoFile()});
  }

  private static getProtoFile() {
    return path.resolve(__dirname, '../../protos/recommendation.proto');
  }
}
