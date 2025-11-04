import {describe, it, expect} from 'vitest';
import { formatCurrency, getSymbol } from '../../../../../frontend/script/utils/currencySymbols.js';

const mockSharedData = (currency) => [{currency}]

describe('currencySymbols', () => {
  describe('GetSymbol', () => {
    it("should return '$' if the currency is 'USD' ", () => {
      expect(getSymbol(mockSharedData('USD'))).toBe('$')
    });

    it("should return '€' if the currency is 'EUR' ", () => {
      expect(getSymbol(mockSharedData('EUR'))).toBe('€')
    });

    it("should return '¥' if the currency is 'JPY' ", () => {
      expect(getSymbol(mockSharedData('JPY'))).toBe('¥')
    });

    it("should return '£'  if the currency is 'GBP' ", () => {
      expect(getSymbol(mockSharedData('GBP'))).toBe('£')
    });

    it("should return 'Kč' if the currency is 'CZK' ", () => {
      expect(getSymbol(mockSharedData('CZK'))).toBe('Kč')
    });
  });

  describe('formatCurrency', () => {
    it("places 'Kč' after the amount if the currency is CZK", () => {
      expect(formatCurrency(5000, 'Kč')).toBe('5000 Kč')
    });

    it("places 'Kč' before the amount if the currency is not 'CZK'", () => {
      expect(formatCurrency(5000, '$')).toBe('$5000')
    });
  });

})