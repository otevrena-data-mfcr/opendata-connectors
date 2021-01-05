export interface CKANPackageList {
  help: string;
  success: boolean;
  result: string[];
}


export interface CKANPackageShow {
  "help": string,
  "success": boolean,
  "result": {
    "id": string,
    "name": string,
    "title": string,
    "publisher_name": string,
    "publisher_uri": string,
    "maintainer_email": string,
    "ruian_code": string,
    "ruian_type": string,
    "license_title": string,
    "license_link": string,
    "notes": string,
    "url": string,
    "state": string,
    "metadata_created": string,
    "metadata_modified": string,
    "type": string,
    "part_of": string,
    "resources": CKANPackageShowResource[],
    "tags": CKANPackageShowTag[],
  }
}

export interface CKANPackageShowResource {
  "id": string,
  "url": string,
  "description": string,
  "format": string,
  "mimetype": string,
  "state": string,
  "name": string,
  "size": string,
  "created": string,
  "last_modified": string
}

export interface CKANPackageShowTag {
  id: string;
  vocabulary_id: number;
  name: string;
}