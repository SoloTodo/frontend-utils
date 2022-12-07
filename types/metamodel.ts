export type MetaField = {
  url?: string;
  help_text: string;
  hidden: boolean;
  id: string;
  model: MetaModel;
  multiple: boolean;
  name: string;
  nullable: boolean;
  ordering: number;
  parent: MetaModel;
};

export type MetaModel = {
  id: number;
  is_primitive: boolean;
  name: string;
  ordering_field: string | null;
  unicode_template: string | null;
  url: string;
  fields?: MetaField[];
};

export type InstanceMetaField = {
  id: string;
  url?: string;
  parent: InstanceMetaModel;
  field: MetaField;
  value: InstanceMetaModel;
};

export type InstanceMetaModel = {
  decimal_value: number | string | null;
  id: number;
  unicode_representation: string;
  unicode_value: string;
  url: string;
  fields?: InstanceMetaField[];
  model: MetaModel;
};
