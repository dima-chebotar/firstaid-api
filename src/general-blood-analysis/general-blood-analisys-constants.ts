export const GET_ANALYSES_FROM_PDF =
  'Please recognize and return me the actual values for each of the following' +
  ' positions: ESR (converted to mm/h), WBC (converted to 10^9/L), RBC ' +
  '(converted to 10^12/L), HGB (converted to G/L), HCT (converted to %), MCV ' +
  '(converted to fl), MCH (converted to pg) and MCHC (converted to G/L), PLT ' +
  '(converted to 10^9/L), RDW-SD (converted to fL), PDW (converted to fL), MPV ' +
  '(converted to fL), P-LCR (converted to %), PCT (converted to %), LYMРH% ' +
  '(converted to %), LYMРH# (converted to 10^9/L), MONO% (converted to %), ' +
  'MONO# (converted to 10^9/L), NEUT# (converted to 10^9/L),' +
  ' EO# (converted to 10^9/L), BASO# (converted to 10^9/L) based on the following text. ' +
  'Make sure to recalculate numbers, converting g/dl to G/L. Make sure to ' +
  'recalculate numbers, converting 10^9 to 10^12. Make sure to recalculate ' +
  'numbers, converting 10^12 to 10^9. ';
