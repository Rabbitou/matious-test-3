export interface ISales {
  invoiceID: string;
  branch: string;
  city: string;
  customerType: string;
  gender: string;
  productLine: string;
  unitPrice: number;
  quantity: number;
  tax_5per: number;
  total: number;
  date: string;
  time: string;
  payment: string;
  cogs: number;
  gross_margin_per: number;
  gross_income: number;
  rating: number;
}
