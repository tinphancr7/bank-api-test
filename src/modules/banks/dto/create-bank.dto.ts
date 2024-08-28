// create-Bank.dto.ts
import { IsString, IsNumber, IsDate, IsNotEmpty, IsDateString, IsOptional } from "class-validator";

export class CreateBankDto {
  @IsNumber()
  id: number;

  @IsString()
  accountNumber: string;

  @IsString()
  accountName: string;

  @IsString()
  @IsOptional() // Optional field, can be null
  accountType?: string | null;

  @IsNumber()
  balance: number;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional() // Optional field, can be null
  swift?: string | null;

  @IsString()
  @IsOptional() // Optional field, can be null
  citad?: string | null;

  @IsString()
  serviceType: string;

  @IsString()
  bankName: string;

  @IsNumber()
  BIN: number;

  @IsString()
  bankCodeName: string;

  @IsString()
  @IsOptional() // Optional field, can be null
  memo?: string | null;

  @IsNumber()
  connectStatus: number;

  @IsDateString()
  beginningSettingDate: string;

  @IsDateString()
  @IsOptional() // Optional field, can be null
  beginningTxnDate?: string | null;

  @IsNumber()
  @IsOptional() // Optional field, can be null
  beginningBalance: number | null;

  @IsNumber()
  @IsOptional() // Optional field, can be null
  creditTxnTotal: number | null;

  @IsNumber()
  @IsOptional() // Optional field, can be null
  creditTxnAmount: number | null;

  @IsNumber()
  @IsOptional() // Optional field, can be null
  debitTxnTotal: number | null;

  @IsNumber()
  debitTxnAmount: number;

  @IsDateString()
  @IsOptional() // Optional field, can be null
  lockSyncDate?: string | null;

  @IsNumber()
  @IsOptional() // Optional field, can be null
  endingBalance: number | null;

  @IsDateString()
  @IsOptional() // Optional field, can be null
  endingTxnDate?: string | null;
}
