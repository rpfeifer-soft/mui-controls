import { css } from "@emotion/css";
import { Button, ButtonGroup, ButtonGroupProps, styled } from "@material-ui/core";

export const OptionButton = styled(Button)({
   textTransform: "capitalize",
});

const SmallButtonGroup = (props: ButtonGroupProps) => <ButtonGroup size="small" {...props} />;

export const OptionGroup = styled(SmallButtonGroup)({
   marginRight: 8,
   marginBottom: 8,
});

export const absolute = css({
   position: "absolute",
   left: 0,
   top: 0,
});
