import { PodminkyUzitiDilo } from "otevrene-formalni-normy-dts"

export const type2mime: { [type: string]: string } = {
  "csv": "text/csv",
  "json": "application/json",
  "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "xls": "application/vnd.ms-excel",
  "zip": "application/zip",
}

export const license2iri = {
  "license_autorske_dilo": {
    "Neobsahuje autorská díla": PodminkyUzitiDilo.NeobsahujeAutorskaDila,
    "Licence CC BY 4": PodminkyUzitiDilo.CCBY4,
    "Obsahuje více autorských děl": PodminkyUzitiDilo.ObsahujeViceAutorskychDel
  } as any,
  "license_originalni_databaze": {
    "Není": "https://data.gov.cz/podmínky-užití/není-autorskoprávně-chráněnou-databází/",
    "Je, licence CC BY 4": "https://creativecommons.org/licenses/by/4.0/"
  } as any,
  "license_zvlastni_prava_databaze": {
    "Není": "https://data.gov.cz/podmínky-užití/není-chráněna-zvláštním-právem-pořizovatele-databáze/",
    "Licence CC0": "https://creativecommons.org/publicdomain/zero/1.0/"
  } as any,
  "license_osobni_udaje": {
    "Ne": "https://data.gov.cz/podmínky-užití/neobsahuje-osobní-údaje/",
    "Ano": "https://data.gov.cz/podmínky-užití/obsahuje-osobní-údaje/"
  } as any
}

export const frequency2iri: any = {
  "Other": "http://publications.europa.eu/resource/authority/frequency/OTHER",
  "Annual": "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
  "Annual_2": "http://publications.europa.eu/resource/authority/frequency/ANNUAL_2",
  "Annual_3": "http://publications.europa.eu/resource/authority/frequency/ANNUAL_3",
  "Biennial": "http://publications.europa.eu/resource/authority/frequency/BIENNIAL",
  "Bimonthly": "http://publications.europa.eu/resource/authority/frequency/BIMONTHLY",
  "Biweekly": "http://publications.europa.eu/resource/authority/frequency/BIWEEKLY",
  "Cont": "http://publications.europa.eu/resource/authority/frequency/CONT",
  "Daily": "http://publications.europa.eu/resource/authority/frequency/DAILY",
  "Daily_2": "http://publications.europa.eu/resource/authority/frequency/DAILY_2",
  "Irreg": "http://publications.europa.eu/resource/authority/frequency/IRREG",
  "Monthly": "http://publications.europa.eu/resource/authority/frequency/MONTHLY",
  "Monthly_2": "http://publications.europa.eu/resource/authority/frequency/MONTHLY_2",
  "Monthly_3": "http://publications.europa.eu/resource/authority/frequency/MONTHLY_3",
  "Never": "http://publications.europa.eu/resource/authority/frequency/NEVER",
  "Op_datpro": "http://publications.europa.eu/resource/authority/frequency/OP_DATPRO",
  "Quarterly": "http://publications.europa.eu/resource/authority/frequency/QUARTERLY",
  "Triennial": "http://publications.europa.eu/resource/authority/frequency/TRIENNIAL",
  "Unknown": "http://publications.europa.eu/resource/authority/frequency/UNKNOWN",
  "Update_cont": "http://publications.europa.eu/resource/authority/frequency/UPDATE_CONT",
  "Weekly_2": "http://publications.europa.eu/resource/authority/frequency/WEEKLY_2",
  "Weekly_3": "http://publications.europa.eu/resource/authority/frequency/WEEKLY_3",
  "Quinquennial": "http://publications.europa.eu/resource/authority/frequency/QUINQUENNIAL",
  "Decennial": "http://publications.europa.eu/resource/authority/frequency/DECENNIAL",
  "Hourly": "http://publications.europa.eu/resource/authority/frequency/HOURLY",
  "Quadrennial": "http://publications.europa.eu/resource/authority/frequency/QUADRENNIAL",
  "Bihourly": "http://publications.europa.eu/resource/authority/frequency/BIHOURLY",
  "Trihourly": "http://publications.europa.eu/resource/authority/frequency/TRIHOURLY",
  "Bidecennial": "http://publications.europa.eu/resource/authority/frequency/BIDECENNIAL",
  "Tridecennial": "http://publications.europa.eu/resource/authority/frequency/TRIDECENNIAL",
}

export const theme2iri: any = {
  "Agriculture": "http://publications.europa.eu/resource/authority/data-theme/AGRI",
  "Economics": "http://publications.europa.eu/resource/authority/data-theme/ECON",
  "Education": "http://publications.europa.eu/resource/authority/data-theme/EDUC",
  "Energy": "http://publications.europa.eu/resource/authority/data-theme/ENER",
  "Environment": "http://publications.europa.eu/resource/authority/data-theme/ENVI",
  "Government": "http://publications.europa.eu/resource/authority/data-theme/GOVE",
  "Health": "http://publications.europa.eu/resource/authority/data-theme/HEAL",
  "International": "http://publications.europa.eu/resource/authority/data-theme/INTR",
  "Justice": "http://publications.europa.eu/resource/authority/data-theme/JUST",
  "Regional": "http://publications.europa.eu/resource/authority/data-theme/REGI",
  "Society": "http://publications.europa.eu/resource/authority/data-theme/SOCI",
  "Technology": "http://publications.europa.eu/resource/authority/data-theme/TECH",
  "Transport": "http://publications.europa.eu/resource/authority/data-theme/TRAN",
}