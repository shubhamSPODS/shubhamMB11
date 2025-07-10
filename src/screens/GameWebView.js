import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, BackHandler, TouchableOpacity, StatusBar } from 'react-native';
import WebView from 'react-native-webview';
import { colors } from '../theme/color';
import { AppText } from '../common/AppText';

const GameWebView = ({ route, navigation }) => {
    const { url, token } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [webViewKey, setWebViewKey] = useState(0);

    useEffect(() => {
        // Hide status bar when component mounts
        StatusBar.setHidden(true);
        
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                StatusBar.setHidden(false); // Show status bar when going back
                navigation.goBack();
                return true;
            }
        );

        return () => {
            StatusBar.setHidden(false); // Show status bar when component unmounts
            backHandler.remove();
        };
    }, []);

    // Inject JavaScript to handle authentication and monitor page
    const injectedJavaScript = `
        (function() {
            // Add authorization header to all fetch requests
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers['Authorization'] = 'Bearer ${token}';
                return originalFetch(url, options);
            };

            // Handle back/quit button clicks
            window.handleQuit = function() {
                console.log('Quit clicked');
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'goBackToApp',
                    timestamp: Date.now(),
                    data: {
                        reason: 'manual_exit',
                        gameData: {
                            reason: 'User clicked quit button',
                            timestamp: Date.now()
                        }
                    }
                }));
            };

            window.handleGoBack = function() {
                console.log('🔙 User clicked Go Back');
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'goBackToApp',
                    timestamp: Date.now(),
                    data: {
                        reason: 'manual_exit',
                        gameData: {
                            reason: 'User clicked go back from matchmaking',
                            scene: 'SearchingScene',
                            timestamp: Date.now()
                        }
                    }
                }));
            };

            // Listen for quit/back button clicks
            document.addEventListener('click', function(e) {
                if (e.target.matches('[data-action="quit"]') || 
                    e.target.matches('.quit-button') || 
                    e.target.matches('#quitButton')) {
                    window.handleQuit();
                }
                if (e.target.matches('[data-action="back"]') || 
                    e.target.matches('.back-button') || 
                    e.target.matches('#backButton')) {
                    window.handleGoBack();
                }
            });

            // WebSocket handling
            window.connectToMatchmaking = function(userId, tableId) {
                const wsUrl = 'ws://103.110.127.215:3006/matchmaking';
                console.log('🔌 Connecting to matchmaking server...', wsUrl);
                
                const ws = new WebSocket(wsUrl);
                
                ws.onopen = () => {
                    console.log('✅ Connected to matchmaking server:', ws.url);
                    // Join matchmaking queue
                    ws.send(JSON.stringify({
                        type: 'join_queue',
                        userId: userId,
                        tableId: tableId
                    }));
                    console.log('🎯 Joining matchmaking queue...');
                };
                
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log('📩 Received message:', data);
                    
                    switch(data.type) {
                        case 'queue_joined':
                            console.log('✅ Joined queue successfully');
                            break;
                        case 'match_found':
                            console.log('🎮 Match found!');
                            break;
                        case 'game_start':
                            console.log('🎲 Game starting!');
                            break;
                        case 'error':
                            console.error('❌ Error:', data.message);
                            break;
                        case 'quit':
                            window.handleQuit();
                            break;
                        case 'go_back':
                            window.handleGoBack();
                            break;
                    }
                };
                
                ws.onerror = (error) => {
                    console.error('❌ WebSocket error:', error);
                };
                
                ws.onclose = () => {
                    console.log('🔌 WebSocket connection closed');
                };
                
                return ws;
            };

            // Auto-connect when page loads
            document.addEventListener('DOMContentLoaded', () => {
                const urlParams = new URLSearchParams(window.location.search);
                const userId = urlParams.get('userId');
                const tableId = urlParams.get('tableId');
                
                if (userId && tableId) {
                    window.gameSocket = connectToMatchmaking(userId, tableId);
                }
            });

            // Monitor network requests
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'network',
                        url: entry.name,
                        duration: entry.duration,
                        initiatorType: entry.initiatorType
                    }));
                });
            });
            observer.observe({ entryTypes: ['resource'] });

            // Intercept console messages
            const originalConsole = window.console;
            window.console = {
                log: (...args) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'console',
                        level: 'log',
                        message: args.join(' ')
                    }));
                    originalConsole.log(...args);
                },
                error: (...args) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'console',
                        level: 'error',
                        message: args.join(' ')
                    }));
                    originalConsole.error(...args);
                }
            };
        })();
        true;
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

    const onError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error:', nativeEvent);
        setError(nativeEvent.description || 'Failed to load content');
        setIsLoading(false);
    };

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('WebView message:', data);
            
            switch (data.type) {
                case 'error':
                    setError(data.message);
                    break;
                case 'console':
                    if (data.level === 'error') {
                        console.error('WebView console error:', data.message);
                    } else {
                        console.log('WebView console ' + data.level + ':', data.message);
                    }
                    break;
                case 'network':
                    console.log('Network request:', data);
                    break;
                case 'goBackToApp':
                    console.log('Received quit/back request:', data);
                    // Clean up and go back
                    if (data.data?.gameData?.reason?.includes('quit') || 
                        data.data?.reason === 'manual_exit') {
                        StatusBar.setHidden(false);
                        navigation.goBack();
                    }
                    break;
            }
        } catch (e) {
            console.log('Raw WebView message:', event.nativeEvent.data);
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
                            'Authorization': `Bearer ${token}`
                        }
                    }}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    onError={onError}
                    injectedJavaScript={injectedJavaScript}
                    onMessage={handleMessage}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.golden} />
                        </View>
                    )}
                    cacheEnabled={false}
                    thirdPartyCookiesEnabled={true}
                    sharedCookiesEnabled={true}
                    mixedContentMode="compatibility"
                    onHttpError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
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
        backgroundColor: colors.black
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent'
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
        zIndex: 1
    },
    loadingText: {
        marginTop: 10,
        color: colors.golden
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    errorText: {
        color: colors.error || '#ff0000',
        textAlign: 'center',
        marginBottom: 10
    },
    errorDetail: {
        color: colors.gray,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20
    },
    reloadButton: {
        backgroundColor: colors.golden,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    reloadText: {
        color: colors.white,
        fontSize: 14
    }
});

export default GameWebView; 