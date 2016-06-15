// ==UserScript==
// @name         Jira - Enable Internal Comments Only
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Prevents the "Share With Customer" button from being shown underneath the Comment box and ensures that only internal comments are available on the workflow transition screens
// @author       Sara Milner <sm@amp.co>, Matthew Lishman <matthew.lishman@amp.co>, Matt Anstey <matthew.anstey@amp.co>, Luke Rodgers <lr@amp.co>, Claire Parker <claire.parker@amp.co>
// @match        https://ampersand.atlassian.net/*
// @grant        none

// ==/UserScript==
/* jshint -W097 */
'use strict'; 

$(function() {

  // Event for when the user tries to comment.
  $(document).on('focus', '#comment', function () {
      // Hide the "Share with Customer" button underneath the Comment text area on the main ticket screen.
      $('.sd-comment-buttons .sd-external-submit').hide();
      if (typeof(ServiceDesk.Comment.Field.prepopulatedComment) === 'function') {
          // Force prepopulated comment to always be blank, because it is useless.
          ServiceDesk.Comment.Field.prepopulatedComment = function(){return ''};
      }
  });

// Select the Internal Comment tab and remove the External Comment tab for all workflow transition
// screens that include the Comment field.
  $(document).on('focus', '.jira-dialog', function () {

      $('.js-sd-internal-comment').click();

      $('.js-sd-internal-comment').removeClass('inactive');

      $('.js-sd-external-comment').hide();

  });

  // Hide the "Share With Customer" button on the "Edit Comment" dialog
  $(document).on('focus', '.aui-dialog2', function () {
      // This is a fix for a strange bug in Jira. On a ticket, start on the Comments tab,
      // select the All tab. Try to edit a comment. You will now see the 'Share with Customer'
      // button! Also, cancel the overlay, only to see an identical overlay without the
      // 'Share With Customer' button! The overlay is opening twice for some reason. This
      // code closes the second one and uses a hacky selector to select all 'Share
      // With Customer' buttons in case there are still more than one and hide them.
      // Hacky because you can't select more than one element using an ID - IDs should
      // be unique on a page of course!
      if($('.aui-dialog2 #button-public').length > 1) {
          $('.aui-dialog2 #button-public')[1].click();
          console.log("Closed buggy identical overlay");
      }
      $('.aui-dialog2 #button-public').hide();
  });

});
