import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientKafka,
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,

    @Inject('ANTIFRAUDSERVICE')
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('transaction.validate');
  }

  @MessagePattern('transaction.validate')
  public transactionValidate(
    @Payload()
    transaction: any,
  ) {
    const { transactionId, transactionAmount } = transaction;
    const valid = this.appService.validate(transactionAmount);
    this.transactionValidation(transactionId, valid);
  }

  transactionValidation(id: string, status: string) {
    console.log('RPTA de la validacioneas', {
      transactionId: id,
      transactionStatus: status,
    });
    return this.client.send('transaction.validate.response', {
      transactionId: id,
      transactionStatus: status,
    });
  }
}
