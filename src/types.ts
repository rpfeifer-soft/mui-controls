import { css } from "@emotion/css";
import { Button, ButtonGroup, styled } from "@material-ui/core";

export const OptionButton = styled(Button)({
   textTransform: "none",
});

export const OptionGroup = styled(ButtonGroup)({
   marginRight: 1,
   marginBottom: 1
});

export const absolute = css({
   position: 'absolute',
   left: 0,
   top: 0
});