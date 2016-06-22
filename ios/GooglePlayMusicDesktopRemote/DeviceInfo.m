//
//  DeviceInfo.m
//  GooglePlayMusicDesktopRemote
//
//  Created by Samuel Attard on 22/06/2016.
//  Copyright © 2016 Samuel Attard. All rights reserved.
//

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "DeviceInfo.h"

@implementation DeviceInfo
@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

-(void) dealloc{
  [[NSNotificationCenter defaultCenter] removeObserver: self];
  [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
}

- (void)deviceOrientationDidChange:(NSNotification *)notification
{
  NSString *oN = @"PORTRAIT";
  UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
  
  if(orientation == 0) //Default orientation
    oN = @"PORTRAIT";
  else if(orientation == UIInterfaceOrientationPortrait)
    oN = @"PORTRAIT";
  else if(orientation == UIInterfaceOrientationLandscapeLeft)
    oN = @"LANDSCAPE";
  else if(orientation == UIInterfaceOrientationLandscapeRight)
    oN = @"LANDSCAPE";
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"orientation"
                                               body:@{@"orientation": oN}];
}

RCT_REMAP_METHOD(getDeviceOrientation, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
  [[NSNotificationCenter defaultCenter] addObserver: self selector:   @selector(deviceOrientationDidChange:) name: UIDeviceOrientationDidChangeNotification object: nil];

  NSString *oN = @"1";
  UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
  
  if(orientation == 0) //Default orientation
    oN = @"1";
  else if(orientation == UIInterfaceOrientationPortrait)
    oN = @"1";
  else if(orientation == UIInterfaceOrientationLandscapeLeft)
    oN = @"0";
  else if(orientation == UIInterfaceOrientationLandscapeRight)
    oN = @"0";
  resolve(oN);
}

RCT_REMAP_METHOD(getDeviceName, resolver2:(RCTPromiseResolveBlock)resolve rejecter2:(RCTPromiseRejectBlock)reject)
{
  resolve([[UIDevice currentDevice] name]);
}


RCT_EXPORT_MODULE();

@end