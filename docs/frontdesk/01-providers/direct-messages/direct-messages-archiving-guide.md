# Archiving and Managing Direct Message Conversations

This guide provides instructions for front desk staff on how to archive, unarchive, and view archived conversations within the direct messaging system.

## Archiving a Conversation

When a conversation is no longer active but needs to be retained for records, you can archive it. Archiving removes it from the main conversation list, keeping the workspace tidy.

*   **How to:** To archive a conversation, you will make a `POST` request to the following endpoint:
    ```
    /dms/:id/archive
    ```
    Replace `:id` with the unique identifier of the conversation you wish to archive.

## Unarchiving a Conversation

If you need to reopen an archived conversation, you can unarchive it. This will restore it to the main conversation list.

*   **How to:** To unarchive a conversation, send a `POST` request to this endpoint:
    ```
    /dms/:id/unarchive
    ```
    Again, replace `:id` with the specific conversation's identifier.

## Viewing Archived Conversations

You can view a list of all conversations that have been archived. This is useful for reviewing past communications.

*   **How to:** To retrieve a list of archived conversations, make a `GET` request to the conversations endpoint and include the `includeArchived` query parameter:
    ```
    /dms?includeArchived=true
    ```
    This will return a list of all conversations, including those that have been archived. By default, archived conversations are not included in the list returned from `/dms`.
