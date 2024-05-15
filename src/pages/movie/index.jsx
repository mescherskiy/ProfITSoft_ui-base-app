import IntlProvider from 'misc/providers/IntlProvider'
import React, { useMemo } from 'react'
import Movie from './containers/Movie'
import useLocationSearch from 'misc/hooks/useLocationSearch'
import getMessages from './intl'
import { Provider } from 'react-redux'
import configureStore from 'misc/redux/configureStore'
import rootReducer from './redux/reducers'

const singleMovieStore = configureStore(rootReducer)

const Index = (props) => {
  const {
    lang,
  } = useLocationSearch();
  const messages = useMemo(() => getMessages(lang), [lang]);
  return (
    <Provider store={singleMovieStore}>
      <IntlProvider messages={messages}>
        <Movie />
      </IntlProvider>
    </Provider>
  )
}

export default Index