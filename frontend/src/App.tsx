import style from './App.module.css';
import Icon_Layout from './desktop_components/Icon_Layout';
import Taskbar from './desktop_components/Taskbar';

function App() {





  return (
    <>
      <section className={style.desktop}>
        <Icon_Layout />

        <Taskbar />
      </section>
    </>
  )
}

export default App
