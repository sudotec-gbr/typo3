/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
define(["require","exports","jquery","../AbstractInteractableModule","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Notification","TYPO3/CMS/Core/Ajax/AjaxRequest","../../Router"],(function(t,e,r,s,a,o,i,l){"use strict";class c extends s.AbstractInteractableModule{constructor(){super(...arguments),this.selectorDeleteTrigger=".t3js-clearTypo3temp-delete",this.selectorOutputContainer=".t3js-clearTypo3temp-output",this.selectorStatContainer=".t3js-clearTypo3temp-stat-container",this.selectorStatsTrigger=".t3js-clearTypo3temp-stats",this.selectorStatTemplate=".t3js-clearTypo3temp-stat-template",this.selectorStatNumberOfFiles=".t3js-clearTypo3temp-stat-numberOfFiles",this.selectorStatDirectory=".t3js-clearTypo3temp-stat-directory"}initialize(t){this.currentModal=t,this.getStats(),t.on("click",this.selectorStatsTrigger,t=>{t.preventDefault(),r(this.selectorOutputContainer).empty(),this.getStats()}),t.on("click",this.selectorDeleteTrigger,t=>{const e=r(t.currentTarget).data("folder"),s=r(t.currentTarget).data("storage-uid");t.preventDefault(),this.delete(e,s)})}getStats(){const t=this.getModalBody();new i(l.getUrl("clearTypo3tempFilesStats")).get({cache:"no-cache"}).then(async e=>{const r=await e.resolve();!0===r.success?(t.empty().append(r.html),a.setButtons(r.buttons),Array.isArray(r.stats)&&r.stats.length>0&&r.stats.forEach(e=>{if(e.numberOfFiles>0){const r=t.find(this.selectorStatTemplate).clone();r.find(this.selectorStatNumberOfFiles).text(e.numberOfFiles),r.find(this.selectorStatDirectory).text(e.directory),r.find(this.selectorDeleteTrigger).attr("data-folder",e.directory),r.find(this.selectorDeleteTrigger).attr("data-storage-uid",e.storageUid),t.find(this.selectorStatContainer).append(r.html())}})):o.error("Something went wrong")},e=>{l.handleAjaxError(e,t)})}delete(t,e){const r=this.getModalBody(),s=this.getModuleContent().data("clear-typo3temp-delete-token");new i(l.getUrl()).post({install:{action:"clearTypo3tempFiles",token:s,folder:t,storageUid:e}}).then(async t=>{const e=await t.resolve();!0===e.success&&Array.isArray(e.status)?(e.status.forEach(t=>{o.success(t.message)}),this.getStats()):o.error("Something went wrong")},t=>{l.handleAjaxError(t,r)})}}return new c}));