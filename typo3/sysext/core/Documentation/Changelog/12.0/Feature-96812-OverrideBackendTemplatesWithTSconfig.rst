.. include:: ../../Includes.txt

==========================================================
Feature: #96812 - Override backend templates with TsConfig
==========================================================

See :issue:`96812`

Description
===========

Introduction
------------

All Fluid templates rendered by backend controllers can be overridden with
own templates on a per-file basis.

This can be configured using TsConfig: Both PageTsConfig and UserTsConfig are
observed. The feature is available for basically all core backend modules, as
well as the backend main frame templates. Exceptions are email templates and
templates of the install tool.

This feature was previously available in a similar way for some specifically
crafted backend controllers, namely the dashboard extension and the page module.
It was based on frontend TypoScript in combination with Extbase magic. This has
been superseded by the new TsConfig based approach. Instances using the old
solution need an adaption. Please find details in the
:doc:`changelog entry<Breaking-96812-NoFrontendTypoScriptBasedTemplateOverridesInTheBackend>`.

.. note::

    While this feature is powerful and allows overriding nearly any backend
    template, it *should be used with care*: Fluid templates of the core
    extensions are *not* considered API. The core development needs the
    freedom to add, change and delete Fluid templates any time, even for
    bugfix releases. Template overrides are similar to an :php:`XCLASS` in
    PHP - the core can not guarantee integrity on this level across versions.


Basic syntax
------------

The various combinations are best explained by example: The linkvalidator
extension (its composer name is "typo3/cms-linkvalidator") comes with a backend
module in the "Web" main section. The page tree is displayed for this module and
linkvalidator has two main views and templates: :file:`Resources/Private/Templates/Backend/Report.html`
for the "Report" view and another one for the "Check link" view. To override
the :file:`Backend/Report.html` with an own template, this definition can
be added to an extensions :file:`Configuration/page.tsconfig` file
(see :doc:`changelog <Feature-96614-AutomaticInclusionOfPageTsConfigOfExtensions>`):

.. code-block:: typoscript

    # Pattern: templates."composer-name"."something-unique" = "overriding-extension-composer-name":"entry-path"
    templates.typo3/cms-linkvalidator.1643293191 = my-vendor/my-extension:Resources/Private/TemplateOverrides

When the target extension identified by its composer name "my-vendor/my-extension" provides the file
:file:`Resources/Private/TemplateOverrides/Templates/Backend/Report.html`, **this** file will
be used instead of the default template file from the linkvalidator extension.

All core extensions stick to the general templates, layouts and partial file and directory position structure.
When an extension needs to override a partial that is located in :file:`Resources/Private/Partials/SomeName/SomePartial.html`,
and an override has been specified like above to :typoscript:`my-vendor/my-extension:Resources/Private/TemplateOverrides`, the
system will look for file :file:`Resources/Private/TemplateOverrides/Partials/SomeName/SomePartial.html`. Similar for layouts.

The path part of the override definition can be set to whatever an integrator prefers,
:file:`Resources/Private/TemplateOverrides` is just an idea here and hopefully not a bad one,
further details rely on additional needs. For instance, it is probably a good idea to include
the composer or extension name of the source extension in the path (linkvalidator in our example),
or when using overrides based on page ids or group ids, to include those in the path. The source
extension sup-path is automatically added by the system when looking for override files, when
a layout file is located at :file:`Resources/Private/Layouts/ExtraLarge/Main.html`, and an
override definition uses path :file:`Resources/Private/TemplateOverrides`, the system
will look up :file:`Resources/Private/TemplateOverrides/Layouts/ExtraLarge/Main.html`.

Templates overrides are based on file-existence: Two files are never merged. An override definition
either kicks in because it actually supplies a file at the correct position with the correct file name,
or it doesn't and the default is used. This can become unhandy for big template files. In such cases
it might be an option to request a split of a big template file into smaller partial files, so an
extension can override a dedicated partial only.

When multiple override paths are defined and more than one of them have overrides for a specific
template, the override definition with the highest numerical value wins:

.. code-block:: typoscript

    templates.typo3/cms-linkvalidator.23 = other-vendor/other-extension:Resources/Private/TemplateOverrides/Linkvalidator
    templates.typo3/cms-linkvalidator.2300 = my-vendor/my-extension:Resources/Private/MyOverrideIsBigger

Due to the nature of TsConfig, and its two shapes PageTsConfig and UserTsConfig,
various combinations are possible:

* Define "global" overrides with PageTsConfig in :file:`page.tsconfig` of an extension.
  This works for all modules, no matter if the module renders a page tree or not.
* Define overrides on page level using the :sql:`TSconfig` field of page records. As
  always with PageTsConfig, sub pages and sub trees inherit these settings from
  parent pages.
* Define overrides on user or (better) group level. As always, UserTsConfig can override
  PageTsConfig by prefixing any setting available as PageTsConfig with :typoscript:`page.`
  in UserTsConfig. A UserTsConfig template override thus starts with :typoscript:`page.templates.`
  instead of :typoscript:`templates.`.


Usage in own modules
--------------------

Extensions with backend modules that use the :doc:`Simplified backend module
template API <Feature-96730-SimplifiedExtbackendModuleTemplateAPI>` automatically
enable the general backend template override feature. Extension authors do not
need to further prepare their extensions to allow template overrides by other extensions.


Impact
======

Third party or custom extensions like a site extension can now change backend
templates if needed. This can be handy to for instance give editors custom
hints in certain areas without custom PHP code, or to do some other quick solutions.

Some core extensions like the dashboard also use this feature when third party extensions
supply additional widgets with templates to register those templates into the dashboard
namespace. See the dashboard extension documentation and :doc:`this changelog <Breaking-96812-NoFrontendTypoScriptBasedTemplateOverridesInTheBackend>`
for more details.

This feature needs to be used with care since the core does not
consider templates as API and a template override may thus break anytime.


.. index:: Backend, TSConfig, ext:backend
