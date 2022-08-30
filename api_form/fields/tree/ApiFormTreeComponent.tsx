import React, { ReactNode, SyntheticEvent, useContext } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormTree, ApiFormTreeChoice } from "./ApiFormTree";
import { TreeItem, TreeView } from "@mui/lab";
import { Typography } from "@mui/material";

type ApiFormTreeComponentProps = {
  name: string;
  label: string;
};

interface RenderTree {
  id: string | number;
  name: string | ReactNode;
  children: RenderTree[];
}

export const choicesYesNo = [
  { label: "Si", value: 1 },
  { label: "No", value: 0 },
];

export default function ApiFormTreeComponent(props: ApiFormTreeComponentProps) {
  const context = useContext(ApiFormContext);
  const field = context.getField(props.name) as ApiFormTree | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${props.name}`;
  }

  let cleanedData: ApiFormTreeChoice[] | undefined = field.cleanedData;
  if (
    typeof field.cleanedData === "undefined" ||
    field.cleanedData.length === 0
  ) {
    if (field.multiple) {
      cleanedData = [];
    } else {
      cleanedData = [{ label: "", value: "" }];
    }
  } else if (!field.multiple) {
    cleanedData = [field.cleanedData[0]];
  }

  function addNode(
    to: RenderTree,
    nodeLabels: string[],
    nodeId: string | number
  ) {
    if (nodeLabels.length === 0) {
      return;
    }

    const firstLabel = nodeLabels[0];
    const otherLabels = nodeLabels.slice(1);

    const present = to.children.filter((t) => t.name === firstLabel);
    if (present.length !== 0) {
      addNode(present[0], otherLabels, nodeId);
    } else {
      const newNode = {
        id: nodeId,
        name: firstLabel,
        children: [],
      };

      if (otherLabels.length > 0) {
        addNode(newNode, otherLabels, nodeId);
      }

      to.children = [...to.children, newNode];
    }
  }

  const treeData: RenderTree = {
    id: "",
    name: <Typography>{props.label}</Typography>,
    children: [],
  };
  for (const choice of field.choices) {
    const choice_labels = choice.label.split(" > ");
    addNode(treeData, choice_labels, choice.value);
  }

  const renderTree = (nodes: RenderTree) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id.toString()}
      label={nodes.name}
      sx={{ padding: 1 }}
    >
      {nodes.children.length !== 0
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const nodeSelect = (_e: SyntheticEvent, nodeIds: string | string[]) => {
    let name = props.name;

    const previousSelected =
      typeof cleanedData !== "undefined"
        ? cleanedData.map((c) => c.value.toString())[0]
        : "";
    if (nodeIds === previousSelected) {
      context.updateUrl({ [name]: [] });
      return;
    }

    if (Array.isArray(nodeIds)) {
      const newValues = nodeIds.map((option) => option);
      context.updateUrl({ [name]: newValues });
    } else {
      context.updateUrl({ [name]: [nodeIds] });
    }
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultEndIcon={null}
      onNodeSelect={nodeSelect}
      selected={
        typeof cleanedData !== "undefined"
          ? cleanedData.map((c) => c.value.toString())[0]
          : ""
      }
      // multiSelect={field.multiple}
    >
      {renderTree(treeData)}
    </TreeView>
  );
}
