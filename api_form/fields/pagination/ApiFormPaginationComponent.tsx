import { useContext } from "react";
import { TablePagination } from "@mui/material";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormPagination } from "./ApiFormPagination";
import { useResponsive } from "../../../hooks";

export default function ApiFormPaginationComponent({
  rowsPerPage,
}: {
  rowsPerPage?: number[];
}) {
  const isMoblie = useResponsive("down", "sm");
  const context = useContext(ApiFormContext);
  const data = context.currentResult;
  const field = context.getField("pagination") as ApiFormPagination | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: pagination`;
  }

  let page: number | null = null;
  let page_size: number | null = null;
  if (typeof field.cleanedData !== "undefined") {
    page = field.cleanedData.page;
    page_size = field.cleanedData.page_size;
  }

  const handleChange = (value: string, name: string) => {
    context.updateUrl({
      [name]: [value],
    });
  };

  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPage ?? [5, 10, 20, 50, 100, 200]}
      component="div"
      colSpan={3}
      count={data ? data.count : 0}
      rowsPerPage={page_size ? Number(page_size) : 5}
      page={page && data ? Number(page) - 1 : 0}
      onPageChange={(_e, v) => handleChange((v + 1).toString(), "page")}
      onRowsPerPageChange={(e) => handleChange(e.target.value, "page_size")}
      labelRowsPerPage={isMoblie ? "" : "Items por pág."}
      labelDisplayedRows={({ from, to, count }) =>
        isMoblie
          ? `${from}–${to}`
          : `${from}–${to} de ${count !== -1 ? count : `más que ${to}`}`
      }
      showFirstButton
      showLastButton
      sx={{
        ".MuiTablePagination-toolbar": {
          padding: 0,
        },
        ".MuiTablePagination-actions": {
          marginLeft: { xs: 0.5, sm: 3 },
        },
      }}
    />
  );
}
