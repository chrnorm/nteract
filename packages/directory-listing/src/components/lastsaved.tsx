import * as React from "react";
import styled from "styled-components";
import TimeAgo from "react-timeago";

type LastSavedProps = {
  lastModified?: Date | null;
};

const TimeAgoTD = styled.td`
  text-align: right;
  color: #6a737d;
  padding-right: 10px;
`;

TimeAgoTD.displayName = "TimeAgoTD";

export class LastSaved extends React.Component<LastSavedProps> {
  static defaultProps = {
    lastModified: null
  };

  render() {
    return (
      <TimeAgoTD>
        {this.props.lastModified != null && (
          <TimeAgo date={this.props.lastModified} />
        )}
      </TimeAgoTD>
    );
  }
}
