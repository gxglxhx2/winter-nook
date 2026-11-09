#import <AppKit/AppKit.h>
#import <WebKit/WebKit.h>

static NSString *const kSaveKey = @"WinterNook.Progress.v1";
static NSString *const kModeKey = @"WinterNook.Mini.v1";
static NSString *const kFullFrameKey = @"WinterNook.FullFrame.v1";
static NSString *const kMiniFrameKey = @"WinterNook.MiniFrame.v1";
static const NSWindowStyleMask MainStyle = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable;

@interface GameWindow : NSWindow
@end
@implementation GameWindow
- (BOOL)canBecomeKeyWindow { return YES; }
- (BOOL)canBecomeMainWindow { return YES; }
@end

static NSColor *Background(void) {
    return [NSColor colorWithSRGBRed:26.0/255.0 green:23.0/255.0 blue:36.0/255.0 alpha:1.0];
}

@interface GameDelegate : NSObject <NSApplicationDelegate, NSWindowDelegate, WKScriptMessageHandler, WKNavigationDelegate>
@property(nonatomic, strong) NSWindow *window;
@property(nonatomic, strong) WKWebView *web;
@property(nonatomic, strong) NSURL *gameURL;
@property(nonatomic, strong) NSMenuItem *modeItem;
@property(nonatomic) BOOL mini;
@property(nonatomic) BOOL applyingFrame;
@property(nonatomic, strong) NSTimer *mouseTimer;
@end

@implementation GameDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)note {
    (void)note;
    NSUserDefaults *defaults = NSUserDefaults.standardUserDefaults;
    self.mini = [defaults boolForKey:kModeKey];
    [self buildMenu];
    self.gameURL = [NSBundle.mainBundle URLForResource:@"index" withExtension:@"html" subdirectory:@"web"];
    if (!self.gameURL) {
        NSAlert *alert = [NSAlert new];
        alert.messageText = @"找不到冬日小窝的游戏文件";
        alert.informativeText = @"请重新解压完整的「冬日小窝.app」，然后再打开。";
        [alert runModal];
        [NSApp terminate:nil];
        return;
    }

    self.window = [[GameWindow alloc] initWithContentRect:NSMakeRect(0,0,950,650)
                                              styleMask:MainStyle backing:NSBackingStoreBuffered defer:NO];
    self.window.releasedWhenClosed = NO;
    self.window.delegate = self;
    self.window.appearance = [NSAppearance appearanceNamed:NSAppearanceNameDarkAqua];
    self.window.backgroundColor = Background();
    self.window.title = @"冬日小窝";
    self.window.titleVisibility = NSWindowTitleHidden;
    self.window.titlebarAppearsTransparent = YES;
    self.window.tabbingMode = NSWindowTabbingModeDisallowed;
    self.window.hidesOnDeactivate = NO;
    if (@available(macOS 11.0, *)) self.window.titlebarSeparatorStyle = NSTitlebarSeparatorStyleNone;

    WKWebViewConfiguration *configuration = [WKWebViewConfiguration new];
    configuration.websiteDataStore = WKWebsiteDataStore.nonPersistentDataStore;
    configuration.preferences.javaScriptCanOpenWindowsAutomatically = NO;
    [configuration.userContentController addScriptMessageHandler:self name:@"winterNook"];
    self.web = [[WKWebView alloc] initWithFrame:NSZeroRect configuration:configuration];
    self.web.navigationDelegate = self;
    self.web.allowsBackForwardNavigationGestures = NO;
    self.web.allowsLinkPreview = NO;
    if (@available(macOS 12.0, *)) self.web.underPageBackgroundColor = Background();
    if (@available(macOS 13.3, *)) self.web.inspectable = [defaults boolForKey:@"WinterNookInspect"];
    self.window.contentView = self.web;
    [self applyModeChoosingScreen:NSScreen.mainScreen];
    [self loadGame];
    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
}

- (void)buildMenu {
    NSMenu *main = [NSMenu new];
    NSMenuItem *appItem = [NSMenuItem new];
    appItem.submenu = [[NSMenu alloc] initWithTitle:@"冬日小窝"];
    [appItem.submenu addItemWithTitle:@"关于冬日小窝" action:@selector(orderFrontStandardAboutPanel:) keyEquivalent:@""];
    [appItem.submenu addItem:NSMenuItem.separatorItem];
    [appItem.submenu addItemWithTitle:@"隐藏冬日小窝" action:@selector(hide:) keyEquivalent:@"h"];
    [appItem.submenu addItem:NSMenuItem.separatorItem];
    [appItem.submenu addItemWithTitle:@"退出冬日小窝" action:@selector(terminate:) keyEquivalent:@"q"];
    [main addItem:appItem];
    NSMenuItem *windowItem = [[NSMenuItem alloc] initWithTitle:@"窗口" action:nil keyEquivalent:@""];
    NSMenu *windowMenu = [[NSMenu alloc] initWithTitle:@"窗口"];
    windowItem.submenu = windowMenu;
    self.modeItem = [windowMenu addItemWithTitle:@"放到屏幕底部" action:@selector(toggleMode:) keyEquivalent:@"m"];
    self.modeItem.keyEquivalentModifierMask = NSEventModifierFlagCommand | NSEventModifierFlagOption;
    self.modeItem.target = self;
    [windowMenu addItemWithTitle:@"最小化" action:@selector(performMiniaturize:) keyEquivalent:@"m"];
    [main addItem:windowItem];
    NSApp.mainMenu = main;
}

- (void)loadGame {
    WKUserContentController *scripts = self.web.configuration.userContentController;
    [scripts removeAllUserScripts];
    NSDictionary *saved = [NSUserDefaults.standardUserDefaults dictionaryForKey:kSaveKey] ?: @{};
    NSDictionary *bootstrap = @{@"saved":saved, @"mini":@(self.mini)};
    NSData *json = [NSJSONSerialization dataWithJSONObject:bootstrap options:0 error:nil];
    NSString *data = json ? [[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding] : @"{}";
    NSString *source = [@"window.WinterNookHost = " stringByAppendingString:data];
    WKUserScript *script = [[WKUserScript alloc] initWithSource:source injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [scripts addUserScript:script];
    [self.web loadFileURL:self.gameURL allowingReadAccessToURL:self.gameURL.URLByDeletingLastPathComponent];
}

- (NSString *)frameKey { return self.mini ? kMiniFrameKey : kFullFrameKey; }

- (NSScreen *)screenForSavedFrame:(NSRect)frame fallback:(NSScreen *)fallback {
    if (NSIsEmptyRect(frame)) return fallback ?: NSScreen.mainScreen ?: NSScreen.screens.firstObject;
    for (NSScreen *screen in NSScreen.screens) {
        if (NSPointInRect(NSMakePoint(NSMidX(frame), NSMidY(frame)), screen.visibleFrame)) return screen;
    }
    return fallback ?: NSScreen.mainScreen ?: NSScreen.screens.firstObject;
}

- (void)applyModeChoosingScreen:(NSScreen *)fallback {
    NSString *prior = self.mini ? nil : [NSUserDefaults.standardUserDefaults stringForKey:self.frameKey];
    NSRect old = prior ? NSRectFromString(prior) : NSZeroRect;
    NSScreen *screen = [self screenForSavedFrame:old fallback:fallback];
    NSRect available = screen ? screen.visibleFrame : NSMakeRect(0,0,1200,760);
    CGFloat usableWidth = MAX(320, NSWidth(available) - 28);
    CGFloat fitHeight = (NSHeight(available) - 339) * 384 / 152 + 50;
    CGFloat width = self.mini ? MIN(640, usableWidth) : MIN(1004, MIN(usableWidth, MAX(640, fitHeight)));
    CGFloat horizontalPadding = width <= 790 ? 36 : 50;
    CGFloat height = self.mini ? ceil(width * 82 / 384)
        : ceil(293 + (width - horizontalPadding) * 152 / 384);
    if (!self.mini) height = MIN(height, NSHeight(available)-35);
    self.applyingFrame = YES;
    self.window.styleMask = self.mini ? NSWindowStyleMaskBorderless : MainStyle;
    self.window.opaque = !self.mini;
    self.window.backgroundColor = self.mini ? NSColor.clearColor : Background();
    self.window.hasShadow = !self.mini;
    self.window.titleVisibility = NSWindowTitleHidden;
    self.window.titlebarAppearsTransparent = YES;
    self.window.tabbingMode = NSWindowTabbingModeDisallowed;
    self.web.underPageBackgroundColor = self.mini ? NSColor.clearColor : Background();
    // WKWebView's backing fill must be clear for a borderless desktop window.
    @try { [self.web setValue:@(!self.mini) forKey:@"drawsBackground"]; } @catch (NSException *e) {}
    NSRect frame = [self.window frameRectForContentRect:NSMakeRect(0,0,width,height)];
    if (prior && NSIntersectsRect(old, available)) {
        frame.origin.x = NSMinX(old);
        frame.origin.y = NSMaxY(old)-NSHeight(frame);
    } else if (self.mini) {
        frame.origin.x = NSMidX(available)-NSWidth(frame)/2;
        frame.origin.y = NSMinY(available)+2;
    } else {
        frame.origin.x = NSMidX(available)-NSWidth(frame)/2;
        frame.origin.y = NSMidY(available)-NSHeight(frame)/2;
    }
    frame.origin.x = round(MAX(NSMinX(available), MIN(NSMaxX(available)-NSWidth(frame), frame.origin.x)));
    frame.origin.y = round(MAX(NSMinY(available), MIN(NSMaxY(available)-NSHeight(frame), frame.origin.y)));
    self.window.level = self.mini ? NSFloatingWindowLevel : NSNormalWindowLevel;
    self.window.collectionBehavior = self.mini ?
        (NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorFullScreenAuxiliary) :
        NSWindowCollectionBehaviorManaged;
    self.modeItem.title = self.mini ? @"返回完整窗口" : @"放到屏幕底部";
    [self.window setFrame:frame display:YES animate:NO];
    self.applyingFrame = NO;
    [self.mouseTimer invalidate];
    self.mouseTimer = nil;
    self.window.ignoresMouseEvents = NO;
    if (self.mini) {
        self.mouseTimer = [NSTimer scheduledTimerWithTimeInterval:.075 target:self
                        selector:@selector(updateMouseRegion:) userInfo:nil repeats:YES];
        [self updateMouseRegion:nil];
    }
}

- (void)updateMouseRegion:(NSTimer *)timer {
    (void)timer;
    NSRect f = self.window.frame;
    NSPoint p = NSEvent.mouseLocation;
    // Most of the snow strip lets clicks reach the desktop or window behind it.
    CGFloat x = (p.x-NSMinX(f))/NSWidth(f), y = (p.y-NSMinY(f))/NSHeight(f);
    BOOL pet = x>=.42 && x<=.55 && y>=.08 && y<=.57;
    BOOL controls = x>=.80 && x<=1 && y>=0 && y<=1;
    self.window.ignoresMouseEvents = !(pet || controls);
}

- (void)rememberFrame {
    if (!self.applyingFrame && self.window && !self.window.isMiniaturized)
        [NSUserDefaults.standardUserDefaults setObject:NSStringFromRect(self.window.frame) forKey:self.frameKey];
}

- (void)toggleMode:(id)sender {
    (void)sender;
    [self rememberFrame];
    NSScreen *screen = self.window.screen;
    self.mini = !self.mini;
    [NSUserDefaults.standardUserDefaults setBool:self.mini forKey:kModeKey];
    NSString *js = self.mini ? @"window.WinterNook?.setMini(true)" : @"window.WinterNook?.setMini(false)";
    [self.web evaluateJavaScript:js completionHandler:nil];
    [self applyModeChoosingScreen:screen];
    if (self.window.isMiniaturized) [self.window deminiaturize:nil];
    [self.window makeKeyAndOrderFront:nil];
}

- (void)userContentController:(WKUserContentController *)controller didReceiveScriptMessage:(WKScriptMessage *)message {
    (void)controller;
    if (!message.frameInfo.isMainFrame || ![message.body isKindOfClass:NSDictionary.class]) return;
    NSDictionary *body = message.body;
    if ([body[@"type"] isEqual:@"mode"]) {
        [self toggleMode:nil];
    } else if ([body[@"type"] isEqual:@"save"] && [body[@"state"] isKindOfClass:NSDictionary.class]) {
        NSDictionary *state = body[@"state"];
        NSMutableDictionary *save = [state mutableCopy];
        // NSNull does not round trip through property lists; false represents an empty slot.
        if (save[@"tree"] == NSNull.null) save[@"tree"] = @NO;
        if ([NSPropertyListSerialization propertyList:save isValidForFormat:NSPropertyListBinaryFormat_v1_0]) {
            [NSUserDefaults.standardUserDefaults setObject:save forKey:kSaveKey];
        }
    }
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)nav
    decisionHandler:(void (^)(WKNavigationActionPolicy))handler {
    (void)webView;
    handler([nav.request.URL isEqual:self.gameURL] ? WKNavigationActionPolicyAllow : WKNavigationActionPolicyCancel);
}
- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    (void)webView; (void)navigation;
    [self.web evaluateJavaScript:self.mini ? @"window.WinterNook?.setMini(true)" : @"window.WinterNook?.setMini(false)" completionHandler:nil];
}
- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView { (void)webView; [self loadGame]; }
- (void)windowDidMove:(NSNotification *)notification { (void)notification; [self rememberFrame]; }
- (void)windowWillClose:(NSNotification *)notification { (void)notification; [self rememberFrame]; }
- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)app { (void)app; return YES; }
- (void)applicationWillTerminate:(NSNotification *)note {
    (void)note;
    [self rememberFrame];
    [self.mouseTimer invalidate];
    [self.web.configuration.userContentController removeScriptMessageHandlerForName:@"winterNook"];
}

@end

int main(int argc, const char *argv[]) {
    (void)argc;(void)argv;
    @autoreleasepool {
        NSApplication *app = NSApplication.sharedApplication;
        [app setActivationPolicy:NSApplicationActivationPolicyRegular];
        GameDelegate *delegate = [GameDelegate new];
        app.delegate = delegate;
        [app run];
    }
    return 0;
}
