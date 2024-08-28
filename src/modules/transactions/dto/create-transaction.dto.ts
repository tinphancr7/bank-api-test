import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  @IsOptional()
  privateId: number;

  @IsString()
  @IsOptional()
  reference: string;

  @IsDateString()
  @IsOptional()
  transactionDate: string;

  @IsDateString()
  @IsOptional()
  transactionDateTime: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  runningBalance: number;

  @IsString()
  @IsOptional()
  virtualAccountNumber: string;

  @IsString()
  @IsOptional()
  virtualAccountName: string;

  @IsString()
  @IsOptional()
  paymentChannel: string;

  @IsString()
  @IsOptional()
  counterAccountNumber: string;

  @IsString()
  @IsOptional()
  counterAccountName: string;

  @IsString()
  @IsOptional()
  counterAccountBankId: string;

  @IsString()
  @IsOptional()
  counterAccountBankName: string;

  @IsNumber()
  @IsOptional()
  accountId: number;

  @IsString()
  @IsOptional()
  bankCodeName: string;

  @IsString()
  @IsOptional()
  raw: string;
}
