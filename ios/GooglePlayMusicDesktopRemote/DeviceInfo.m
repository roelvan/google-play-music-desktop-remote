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