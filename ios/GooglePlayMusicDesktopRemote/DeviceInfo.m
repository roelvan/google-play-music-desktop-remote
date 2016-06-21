//
//  DeviceInfo.m
//  GooglePlayMusicDesktopRemote
//
//  Created by Samuel Attard on 22/06/2016.
//  Copyright © 2016 Samuel Attard. All rights reserved.
//

#import "DeviceInfo.h"

@implementation DeviceInfo

RCT_REMAP_METHOD(getDeviceOrientation, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *oString = @"portrait";
  UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
  
  if(orientation == 0) //Default orientation
    oString = @"portrait";
  else if(orientation == UIInterfaceOrientationPortrait)
    oString = @"portrait";
  else if(orientation == UIInterfaceOrientationLandscapeLeft)
    oString = @"landscape";
  else if(orientation == UIInterfaceOrientationLandscapeRight)
    oString = @"landscape";
  resolve(oString);
}

RCT_REMAP_METHOD(getDeviceName, resolver2:(RCTPromiseResolveBlock)resolve rejecter2:(RCTPromiseRejectBlock)reject)
{
  resolve([[UIDevice currentDevice] name]);
}

RCT_EXPORT_MODULE();

@end