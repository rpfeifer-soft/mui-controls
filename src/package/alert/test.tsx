/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import Alert from '.';
import { makeStyles } from '@material-ui/core';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

const useStyles = makeStyles(() => ({
   alert: {
      marginBottom: 8
   }
}));

export interface AlertTestProps extends HtmlDivProps {
}

const AlertTest = observer(({children, ...props}: React.PropsWithChildren<AlertTestProps>) => {
   const styles = useStyles();
   const icon = <div>x</div>;
   return (
      <div {...props}>
         <Alert className={styles.alert} severity="success" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} severity="info" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} severity="warning" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} severity="error" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="success" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="info" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="warning" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="error" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="success" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="info" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="warning" closeIcon={icon}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="error" closeIcon={icon}>Test</Alert>
      </div>
   );
});

export default AlertTest;