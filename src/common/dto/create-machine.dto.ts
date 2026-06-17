export class CreateMachineDto {
  machineAlias: string;
  connectType: number;
  ip?: string;
  serialPort?: number;
  port?: number;
  baudrate?: number;
  machineNumber?: number;
  isHost?: number;
  enabled?: number;
  commPassword?: string;
  purpose?: number;
  sn?: string;
  isAndroid?: string;
}
