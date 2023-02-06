import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'antifraud-kafka',
        brokers: ['localhost:9092'],
      },
    },
  } as MicroserviceOptions);

  app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
