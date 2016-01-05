"use strict";

angular.module('habitrpg').controller("FooterCtrl",
['$scope', '$rootScope', 'User', '$http', 'Notification', 'ApiUrl', 'Social',
function($scope, $rootScope, User, $http, Notification, ApiUrl, Social) {

  $scope.loadWidgets = Social.loadWidgets;

  if(env.isStaticPage){
    $scope.languages = env.avalaibleLanguages;
    $scope.selectedLanguage = _.find(env.avalaibleLanguages, {code: env.language.code});

    $rootScope.selectedLanguage = $scope.selectedLanguage;

    $scope.changeLang = function(){
      window.location = '?lang='+$scope.selectedLanguage.code;
    }
  }

  /**
   * Debug functions. Note that the server route for gems is only available if process.env.DEBUG=true
   */
  if (_.contains(['development','test'],window.env.NODE_ENV)) {

    $scope.setHealthLow = function(){
      User.set({
        'stats.hp': 1
      });
    };

    $scope.addMissedDay = function(numberOfDays){
      if (!confirm("Are you sure you want to reset the day by " + numberOfDays + " day(s)?")) return;
      var dayBefore = moment(User.user.lastCron).subtract(numberOfDays, 'days').toDate();
      User.set({'lastCron': dayBefore});
      Notification.text('-' + numberOfDays + ' day(s), remember to refresh');
    };

    $scope.addTenGems = function(){
      $http.post(ApiUrl.get() + '/api/v2/user/addTenGems').success(function(){
        User.log({});
      })
    };

    $scope.addHourglass = function(){
      $http.post(ApiUrl.get() + '/api/v2/user/addHourglass').success(function(){
        User.log({});
      })
    };

    $scope.addGold = function(){
      User.set({
        'stats.gp': User.user.stats.gp + 500,
      });
    };

    $scope.addMana = function(){
      User.set({
        'stats.mp': User.user.stats.mp + 500,
      });
    };

    $scope.addLevelsAndGold = function(){
      User.set({
        'stats.exp': User.user.stats.exp + 10000,
        'stats.gp':  User.user.stats.gp  + 10000,
        'stats.mp':  User.user.stats.mp  + 10000
      });
    };

    $scope.addOneLevel = function(){
      User.set({
        'stats.exp': User.user.stats.exp + (Math.round(((Math.pow(User.user.stats.lvl, 2) * 0.25) + (10 * User.user.stats.lvl) + 139.75) / 10) * 10)
      });
    };

    $scope.addBossQuestProgressUp = function(){
      User.set({
        'party.quest.progress.up': User.user.party.quest.progress.up + 1000
      });
    };
  }
}])
