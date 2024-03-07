import React from 'react';
import { View, StyleSheet, FlatList, StatusBar } from 'react-native';
import {
  Appbar,
  Text,
  Avatar,
  useTheme,
  Menu,
  ProgressBar,
} from 'react-native-paper';
import { AppContext } from '../App';
import Post from '../components/Post';
import * as API from '../utils/sidechatAPI';

const BORDER_RADIUS = 12;

function HomeScreen({ navigation }) {
  const appState = React.useContext(AppContext);
  const [postCategory, setPostCategory] = React.useState('hot');
  const [cursor, setCursor] = React.useState(null);
  const { colors } = useTheme();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [loadingPosts, setLoadingPosts] = React.useState(true);
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    if (appState.groupID && appState.userToken) {
      setLoadingPosts(true);
      fetchPosts(true);
    } else {
      console.warn('App state is undefined, will load in a second');
    }
  }, [postCategory, appState]);
  const renderItem = React.useCallback(
    each => <Post post={each.item} nav={navigation} />,
    [],
  );
  const fetchPosts = refresh => {
    setLoadingPosts(true);
    if (refresh) {
      API.getGroupPosts(
        appState.groupID,
        appState.userToken,
        postCategory,
      ).then(res => {
        setPosts(res.posts);
        setCursor(res.cursor);
        setLoadingPosts(false);
      });
    } else {
      API.getGroupPosts(
        appState.groupID,
        appState.userToken,
        postCategory,
        cursor,
      ).then(res => {
        setPosts(posts.concat(res.posts));
        setCursor(res.cursor);
        setLoadingPosts(false);
      });
    }
  };
  return (
    <>
      <StatusBar animated={true} backgroundColor={colors.background} />
      {appState.groupName && (
        <Appbar.Header style={{ zIndex: 1 }}>
          <Appbar.Content
            title={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Text
                  size={45}
                  label={
                    appState.groupName.length < 3
                      ? appState.groupName
                      : appState.groupName.substring(0, 2)
                  }
                  style={{
                    borderRadius: BORDER_RADIUS,
                    marginRight: 15,
                    backgroundColor:
                      appState.groupColor || colors.primaryContainer,
                  }}
                />
                {appState.groupName.length > 2 ? (
                  <Text>{appState.groupName}</Text>
                ) : (
                  <Text variant="headlineSmall">
                    {postCategory[0].toUpperCase() + postCategory.slice(1)}{' '}
                    Posts
                  </Text>
                )}
              </View>
            }
          />

          <Menu
            anchor={
              <Appbar.Action
                icon="filter-variant"
                onPress={() => setFilterOpen(true)}></Appbar.Action>
            }
            visible={filterOpen}
            onDismiss={() => setFilterOpen(false)}>
            <Menu.Item
              title="Hot"
              leadingIcon={postCategory == 'hot' ? 'check' : 'fire'}
              style={{
                backgroundColor:
                  postCategory == 'hot' ? colors.primaryContainer : null,
              }}
              onPress={() => {
                setPostCategory('hot');
                setFilterOpen(false);
              }}
            />
            <Menu.Item
              title="Top"
              leadingIcon={
                postCategory == 'top' ? 'check' : 'arrow-up-bold-box'
              }
              style={{
                backgroundColor:
                  postCategory == 'top' ? colors.primaryContainer : null,
              }}
              onPress={() => {
                setPostCategory('top');
                setFilterOpen(false);
              }}
            />
            <Menu.Item
              title="New"
              leadingIcon={postCategory == 'recent' ? 'check' : 'new-box'}
              style={{
                backgroundColor:
                  postCategory == 'recent' ? colors.primaryContainer : null,
              }}
              onPress={() => {
                setPostCategory('recent');
                setFilterOpen(false);
              }}
            />
          </Menu>
          <Appbar.Action
            icon="account"
            onPress={() => navigation.push('MyProfile')}></Appbar.Action>
          <Appbar.Action
            icon="cog"
            onPress={() => navigation.push('Settings')}></Appbar.Action>
        </Appbar.Header>
      )}
      <View style={{ ...style.container, backgroundColor: colors.background }}>
        <ProgressBar indeterminate={true} visible={loadingPosts} />
        <FlatList
          style={{ padding: 10 }}
          contentContainerStyle={{ gap: 10 }}
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          estimatedItemSize={250}
          windowSize={10}
          onRefresh={() => fetchPosts(true)}
          refreshing={loadingPosts}
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchPosts(false)}
        />
      </View>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
