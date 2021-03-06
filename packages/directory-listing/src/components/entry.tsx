import * as React from "react";
import { areComponentsEqual } from "react-hot-loader";
import styled from "styled-components";

import { Icon } from "./icon";
import { Name } from "./name";
import { LastSaved } from "./lastsaved";

type EntryProps = {
  children: React.ReactNode;
};

const DirectoryEntry = styled.tr`
  border-top: 1px solid #eaecef;

  :hover {
    background-color: #f6f8fa;
    transition: background-color 0.1s ease-out;
  }

  :first-child {
    border-top: none;
  }

  :last-child {
    border-bottom: none;
  }
`;

DirectoryEntry.displayName = "DirectoryEntry";

export class Entry extends React.Component<EntryProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return (
      <DirectoryEntry>
        {React.Children.map(this.props.children, child => {
          const childElement = child as React.ReactElement<any>;
          if (
            areComponentsEqual(
              childElement.type as React.ComponentType<any>,
              Icon
            ) ||
            areComponentsEqual(
              childElement.type as React.ComponentType<any>,
              Name
            ) ||
            areComponentsEqual(
              childElement.type as React.ComponentType<any>,
              LastSaved
            )
          ) {
            return React.cloneElement(childElement, {
              className:
                typeof childElement.props.className === "string" &&
                childElement.props.className !== ""
                  ? childElement.props.className + " directory-entry-field"
                  : "directory-entry-field"
            });
          } else {
            return <td className="directory-entry-field">{child}</td>;
          }
        })}
      </DirectoryEntry>
    );
  }
}
