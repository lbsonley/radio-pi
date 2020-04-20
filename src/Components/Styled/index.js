import styled from "styled-components";

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  flex-wrap: ${(props) => props.wrap || "nowrap"};
  flex: 1 0 auto;
`;

export const Container = styled.div`
  padding: 14px;
`;
