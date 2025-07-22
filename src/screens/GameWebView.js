import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  BackHandler,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import {colors} from '../theme/color';
import {AppText} from '../common/AppText';

const GameWebView = ({route, navigation}) => {
  const {url, token} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webViewKey, setWebViewKey] = useState(0);

  useEffect(() => {
    StatusBar.setHidden(true);

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        StatusBar.setHidden(false);
        navigation.goBack();
        return true;
      },
    );

    return () => {
      StatusBar.setHidden(false);
      backHandler.remove();
    };
  }, [navigation]);

  const injectedJavaScript = `
        (function() {
            // Hide any potential browser UI elements
            const style = document.createElement('style');
            style.innerHTML = \`
                * {
                    -webkit-user-select: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                }
                
                /* Hide any potential navigation elements */
                [role="navigation"],
                nav,
                .nav,
                .navigation,
                .navbar,
                .header-nav {
                    display: none !important;
                }
                
                /* Ensure full screen */
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow-x: hidden !important;
                }
            \`;
            document.head.appendChild(style);
            
            // Prevent right-click context menu
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Prevent text selection
            document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            true; // Required for iOS
        })();
    `;

  const onLoadStart = () => {
    console.log('WebView loading started:', url);
    setIsLoading(true);
    setError(null);
  };

  const onLoadEnd = () => {
    console.log('WebView loading finished');
    setIsLoading(false);
  };

  const onError = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    console.warn('WebView error:', nativeEvent);
    setError(nativeEvent.description || 'Failed to load content');
    setIsLoading(false);
  };

  const handleMessage = event => {
    const {data} = event.nativeEvent;
    console.log('[GameWebView] Received message:', data);

    try {
      // Try to parse JSON in case complex data is sent
      let messageData = data;
      try {
        messageData = JSON.parse(data);
      } catch {
        // If it's not JSON, treat as string
        messageData = data;
      }

      // Handle different message types
      if (
        messageData === 'goBackToApp' ||
        messageData?.type === 'goBackToApp'
      ) {
        console.log('[GameWebView] Closing WebView due to goBackToApp message');
        StatusBar.setHidden(false);
        navigation.goBack();
      } else if (messageData?.type === 'log') {
        // Optional: Handle logging messages from web app
        console.log('[GameWebView] Web log:', messageData.message);
      } else {
        console.log('[GameWebView] Unhandled message:', messageData);
      }
    } catch (error) {
      console.error(
        '[GameWebView] Error handling message:',
        error,
        'Data:',
        data,
      );
    }
  };

  const reload = () => {
    console.log('Reloading WebView...');
    setWebViewKey(prev => prev + 1);
    setIsLoading(true);
    setError(null);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.golden} />
          <AppText style={styles.loadingText}>Loading game...</AppText>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <AppText style={styles.errorText}>{error}</AppText>
          <AppText style={styles.errorDetail}>URL: {url}</AppText>
          <TouchableOpacity onPress={reload} style={styles.reloadButton}>
            <AppText style={styles.reloadText}>Try Again</AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          key={webViewKey}
          source={{
            uri: url,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }}
          style={styles.webview}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onError={onError}
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
          // Security and UX settings
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsBackForwardNavigationGestures={false}
          allowsLinkPreview={false}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          // Disable context menu and selection
          allowsProtectedMedia={true}
          bounces={false}
          scrollEnabled={true}
          // Hide navigation controls
          hideKeyboardAccessoryView={true}
          keyboardDisplayRequiresUserAction={false}
          // App State handling improvements
          androidLayerType="hardware"
          cacheEnabled={false}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          mixedContentMode="compatibility"
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('HTTP Error:', nativeEvent);
          }}
          onContentProcessDidTerminate={() => {
            console.log('WebView process terminated');
            reload();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: colors.golden,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error || '#ff0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetail: {
    color: colors.gray,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  reloadButton: {
    backgroundColor: colors.golden,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  reloadText: {
    color: colors.white,
    fontSize: 14,
  },
});

export default GameWebView;
