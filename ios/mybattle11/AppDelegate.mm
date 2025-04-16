#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

@implementation AppDelegate

// ✅ Register for push notifications
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    if ([FIRApp defaultApp] == nil) {
        [FIRApp configure];
        NSLog(@"🔥 Firebase initialized successfully!");
    } else {
        NSLog(@"✔️ Firebase is already initialized.");
    }

    // ✅ Set up push notification center delegate
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;  // ✅ This line is now correct!

    // ✅ Request permission for notifications
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                          completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted) {
            NSLog(@"✅ Push Notification permission granted.");
        } else {
            NSLog(@"❌ Push Notification permission denied.");
        }
    }];
    
    [[UIApplication sharedApplication] registerForRemoteNotifications];

    self.moduleName = @"mybattle11";  // ✅ This property now works!
    self.initialProps = @{};

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  NSMutableDictionary *userInfo = [[NSMutableDictionary alloc] init];
  [userInfo setObject:options forKey:@"options"];
  [userInfo setObject:url forKey:@"openUrl"];
  [[NSNotificationCenter defaultCenter] postNotificationName: @"ApplicationOpenURLNotification" object:nil userInfo:userInfo];
  return YES;
}

// ✅ Successfully registered for remote notifications
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
    NSLog(@"✅ Registered for remote notifications.");
}

// ✅ Failed to register for push notifications
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    NSLog(@"❌ Failed to register for remote notifications: %@", error.localizedDescription);
}

// ✅ Handle push notifications when app is in foreground
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
    NSLog(@"📩 Notification received in foreground: %@", notification.request.content.userInfo);
    completionHandler(UNNotificationPresentationOptionSound | 
                      UNNotificationPresentationOptionAlert | 
                      UNNotificationPresentationOptionBadge);
}

// ✅ Handle push notifications when user taps on them
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
    NSLog(@"📨 User tapped on notification: %@", response.notification.request.content.userInfo);
    [RNCPushNotificationIOS didReceiveNotificationResponse:response];
    completionHandler();
}

// ✅ Specify the bundle URL
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
    return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
