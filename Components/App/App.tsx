import styles from "./App.module.scss";

const App = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};

export default App;
