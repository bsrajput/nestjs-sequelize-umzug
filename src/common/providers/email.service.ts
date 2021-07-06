import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { ProviderType } from "../constants/providers";

export const emailServiceProvider = {
  provide: ProviderType.EMAIL_SERVICE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueEmail = configService.get<string>("RMQ_QUEUE_EMAIL", "email");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueEmail,
      },
    });
  },
};
