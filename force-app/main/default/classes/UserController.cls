public with sharing class UserController {
    @AuraEnabled(cacheable=true)
    public static User[] getByNameAndTitle(String name, String title){
        User[] users = new List<User>();
        String whereClause = ' WHERE IsActive = true';
        String[] criteria = new List<String>();

        if(String.isEmpty(name) == false){
            criteria.add('Name LIKE \'%' + name + '%\'');
        }
        if(String.isEmpty(title) == false){
            criteria.add('Title LIKE \'%' + title + '%\'');
        }
        if (criteria.size() > 0) {
            whereClause += ' AND ' + String.join( criteria, ' AND ' );

            users = Database.query('SELECT Alias, Name, SmallPhotoUrl FROM User' + whereClause);
        }
        return users;
    }
}
