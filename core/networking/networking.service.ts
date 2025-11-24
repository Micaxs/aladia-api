import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NetworkingService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  async sendAuth<TInput = any, TOutput = any>(pattern: string, data?: TInput): Promise<TOutput> {
    const payload = (data ?? ({} as unknown)) as TInput;
    return firstValueFrom(this.authClient.send<TOutput, TInput>({ cmd: pattern }, payload));
  }
}
