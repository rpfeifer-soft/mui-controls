/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { capitalize, darken, IconButton, lighten, makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
   const getColor = theme.palette.type === 'light' ? darken : lighten;
   const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;

   return {
      /* Styles applied to the root element. */
      root: {
         ...theme.typography.body2,
         borderRadius: theme.shape.borderRadius,
         backgroundColor: 'transparent',
         display: 'flex',
         padding: '6px 16px',
      },
      /* Styles applied to the root element if `variant="standard"` and `color="success"`. */
      standardSuccess: {
         color: getColor(theme.palette.success.main, 0.6),
         backgroundColor: getBackgroundColor(theme.palette.success.main, 0.9),
         '& $icon': {
            color: theme.palette.success.main,
         },
      },
      /* Styles applied to the root element if `variant="standard"` and `color="info"`. */
      standardInfo: {
         color: getColor(theme.palette.info.main, 0.6),
         backgroundColor: getBackgroundColor(theme.palette.info.main, 0.9),
         '& $icon': {
            color: theme.palette.info.main,
         },
      },
      /* Styles applied to the root element if `variant="standard"` and `color="warning"`. */
      standardWarning: {
         color: getColor(theme.palette.warning.main, 0.6),
         backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.9),
         '& $icon': {
            color: theme.palette.warning.main,
         },
      },
      /* Styles applied to the root element if `variant="standard"` and `color="error"`. */
      standardError: {
         color: getColor(theme.palette.error.main, 0.6),
         backgroundColor: getBackgroundColor(theme.palette.error.main, 0.9),
         '& $icon': {
            color: theme.palette.error.main,
         },
      },
      /* Styles applied to the root element if `variant="outlined"` and `color="success"`. */
      outlinedSuccess: {
         color: getColor(theme.palette.success.main, 0.6),
         border: `1px solid ${theme.palette.success.main}`,
         '& $icon': {
            color: theme.palette.success.main,
         },
      },
      /* Styles applied to the root element if `variant="outlined"` and `color="info"`. */
      outlinedInfo: {
         color: getColor(theme.palette.info.main, 0.6),
         border: `1px solid ${theme.palette.info.main}`,
         '& $icon': {
            color: theme.palette.info.main,
         },
      },
      /* Styles applied to the root element if `variant="outlined"` and `color="warning"`. */
      outlinedWarning: {
         color: getColor(theme.palette.warning.main, 0.6),
         border: `1px solid ${theme.palette.warning.main}`,
         '& $icon': {
            color: theme.palette.warning.main,
         },
      },
      /* Styles applied to the root element if `variant="outlined"` and `color="error"`. */
      outlinedError: {
         color: getColor(theme.palette.error.main, 0.6),
         border: `1px solid ${theme.palette.error.main}`,
         '& $icon': {
            color: theme.palette.error.main,
         },
      },
      /* Styles applied to the root element if `variant="filled"` and `color="success"`. */
      filledSuccess: {
         color: '#fff',
         fontWeight: theme.typography.fontWeightMedium,
         backgroundColor: theme.palette.success.main,
      },
      /* Styles applied to the root element if `variant="filled"` and `color="info"`. */
      filledInfo: {
         color: '#fff',
         fontWeight: theme.typography.fontWeightMedium,
         backgroundColor: theme.palette.info.main,
      },
      /* Styles applied to the root element if `variant="filled"` and `color="warning"`. */
      filledWarning: {
         color: '#fff',
         fontWeight: theme.typography.fontWeightMedium,
         backgroundColor: theme.palette.warning.main,
      },
      /* Styles applied to the root element if `variant="filled"` and `color="error"`. */
      filledError: {
         color: '#fff',
         fontWeight: theme.typography.fontWeightMedium,
         backgroundColor: theme.palette.error.main,
      },
      /* Styles applied to the icon wrapper element. */
      icon: {
         marginRight: 12,
         padding: '7px 0',
         display: 'flex',
         fontSize: 22,
         opacity: 0.9,
      },
      /* Styles applied to the message wrapper element. */
      message: {
         padding: '8px 0',
      },
      /* Styles applied to the action wrapper element if `action` is provided. */
      action: {
         display: 'flex',
         alignItems: 'center',
         marginLeft: 'auto',
         paddingLeft: 16,
         marginRight: -8,
      },
   };
});

export interface AlertProps {
   action?: React.ReactNode;
   closeText?: string;
   severity?: 'error' | 'info' | 'success' | 'warning';
   children?: React.ReactNode,
   icon?: React.ReactNode | false;
   closeIcon: React.ReactNode;
   className?: string,
   role?: string;
   onClose?: (event: React.SyntheticEvent) => void;
   variant?: 'standard' | 'filled' | 'outlined';
}

const Alert = observer((props: AlertProps) => {
   const styles = useStyles();

   const {
      action,
      closeText = 'Close',
      icon,
      onClose,
      children,
      closeIcon,
      className,
      role = 'alert',
      severity = 'success',
      variant = 'standard',
      ...other
   } = props;

   const variantName = (styles as any)[`${variant}${capitalize(severity)}`];
   return (
      <Paper
         role={role}
         square
         elevation={0}
         className={`${styles.root} ${variantName} ${(className || '')}`}
         {...other}
      >
         {icon !== false ? (
            <div className={styles.icon}>
               {icon}
            </div>
         ) : null}
         <div className={styles.message}>{children}</div>
         {action != null ? <div className={styles.action}>{action}</div> : null}
         {action == null && onClose ? (
            <div className={styles.action}>
               <IconButton
                  size="small"
                  aria-label={closeText}
                  title={closeText}
                  color="inherit"
                  onClick={onClose}
               >
                  {closeIcon}
               </IconButton>
            </div>
         ) : null}
      </Paper>
   );
});


export default Alert;