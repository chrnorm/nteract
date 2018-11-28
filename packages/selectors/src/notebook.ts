import * as Immutable from "immutable";
import * as commutable from "@nteract/commutable";

import { ImmutableCell } from "@nteract/commutable";

// All these selectors expect a NotebookModel as the top level state
import { NotebookModel, CellId } from "@nteract/types";
import { createSelector } from "reselect";

/**
 * Returns the cellMap within a given NotebookModel. Returns an empty
 * Immutable.Map if no cellMap exists in the NotebookModel.
 *
 * @param model {NotebookModel}
 * @returns {Immutable.Map}
 */
export const cellMap = (model: NotebookModel) =>
  model.notebook.get("cellMap", Immutable.Map<CellId, ImmutableCell>());

export const cellById = (model: NotebookModel, { id }: { id: CellId }) =>
  cellMap(model).get(id);

export const cellOrder = (model: NotebookModel): Immutable.List<CellId> =>
  model.notebook.get("cellOrder", Immutable.List<CellId>());

export const cellFocused = (model: NotebookModel): CellId | null | undefined =>
  model.cellFocused;
export const editorFocusedId = (
  model: NotebookModel
): CellId | null | undefined => model.editorFocused;

export const codeCellIdsBelow = (model: NotebookModel) => {
  const cellFocused = model.cellFocused;
  if (!cellFocused) {
    // NOTE: if there is no focused cell, this runs none of the cells
    return Immutable.List<CellId>();
  }
  const cellOrder = model.notebook.get("cellOrder", Immutable.List<CellId>());

  const index = cellOrder.indexOf(cellFocused);
  return cellOrder
    .skip(index)
    .filter(
      (id: string) =>
        model.notebook.getIn(["cellMap", id, "cell_type"]) === "code"
    );
};

export const hiddenCellIds = createSelector(
  [cellMap, cellOrder],
  (cellMap, cellOrder) => {
    return cellOrder.filter(id =>
      cellMap.getIn([id, "metadata", "inputHidden"])
    );
  }
);

export const idsOfHiddenOutputs = createSelector(
  [cellMap, cellOrder],
  (cellMap, cellOrder): Immutable.List<CellId> => {
    if (!cellOrder || !cellMap) {
      return Immutable.List<CellId>();
    }

    return cellOrder.filter(CellId =>
      cellMap.getIn([CellId, "metadata", "outputHidden"])
    );
  }
);

export const transientCellMap = (model: NotebookModel) =>
  model.transient.get("cellMap", Immutable.Map());

export const codeCellIds = createSelector(
  [cellMap, cellOrder],
  (cellMap, cellOrder) => {
    return cellOrder.filter(id => cellMap.getIn([id, "cell_type"]) === "code");
  }
);

export const metadata = (model: NotebookModel) =>
  model.notebook.get("metadata", Immutable.Map());

export const githubUsername = createSelector(
  [metadata],
  metadata => metadata.get("github_username", null)
);

export const gistId = createSelector(
  [metadata],
  metadata => metadata.get("gist_id", null)
);

export const notebook = (model: NotebookModel) => model.notebook;
export const savedNotebook = (model: NotebookModel) => model.savedNotebook;

export const isDirty = createSelector(
  notebook,
  savedNotebook,
  (original, disk) => !Immutable.is(original, disk)
);

export const asJSON = createSelector(
  [notebook],
  notebook => {
    return commutable.toJS(notebook);
  }
);

/**
 * Returns the stringified version of a notebook. Returns an empty string
 * if no notebookJS exists. Note that this is called asString instead of
 * toString so that REPLs don't think of this as the representation of this
 * module.
 */
export const asString = createSelector(
  [asJSON],
  notebookJS => {
    if (notebookJS) {
      return commutable.stringifyNotebook(notebookJS);
    }
    return "";
  }
);

const CODE_MIRROR_MODE_DEFAULT = "text";

export const codeMirrorMode = createSelector(
  metadata,
  metadata =>
    metadata.getIn(["language_info", "codemirror_mode"]) ||
    metadata.getIn(["kernel_info", "language"]) ||
    metadata.getIn(["kernelspec", "language"]) ||
    CODE_MIRROR_MODE_DEFAULT
);

export const displayName = createSelector(
  [metadata],
  metadata => metadata.getIn(["kernelspec", "display_name"], "")
);
