from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, ProjectMember, Task, Comment, Notification, ActivityLog

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'display_name', 'avatar']

class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    user_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = ProjectMember
        fields = ['id', 'user', 'user_id', 'role', 'joined_at']
        read_only_fields = ['id', 'joined_at']

class ProjectListSerializer(serializers.ModelSerializer):
    owner = UserBasicSerializer(read_only=True)
    members_count = serializers.ReadOnlyField()
    progress = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'members_count', 'progress', 'created_at', 'updated_at']

class ProjectDetailSerializer(serializers.ModelSerializer):
    owner = UserBasicSerializer(read_only=True)
    members = ProjectMemberSerializer(many=True, read_only=True)
    members_count = serializers.ReadOnlyField()
    progress = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'members', 'members_count', 'progress', 'is_archived', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'description']
        
    def create(self, validated_data):
        user = self.context['request'].user
        project = Project.objects.create(owner=user, **validated_data)
        # Add owner as admin member
        ProjectMember.objects.create(project=project, user=user, role='admin')
        return project

class TaskListSerializer(serializers.ModelSerializer):
    assignee = UserBasicSerializer(read_only=True)
    reporter = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'priority', 'assignee', 'reporter', 'due_date', 'order', 'created_at', 'updated_at']

class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    assignee_id = serializers.UUIDField(required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'status', 'priority', 'assignee_id', 'due_date', 'order']
        
    def validate_assignee_id(self, value):
        if value:
            try:
                user = User.objects.get(id=value)
                # Check if user is member of the project
                project = self.context.get('project')
                if project and not ProjectMember.objects.filter(project=project, user=user).exists():
                    raise serializers.ValidationError("User must be a member of the project")
                return value
            except User.DoesNotExist:
                raise serializers.ValidationError("User does not exist")
        return value

class CommentSerializer(serializers.ModelSerializer):
    author = UserBasicSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'body', 'author', 'parent', 'task', 'replies', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
        
    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []

class NotificationSerializer(serializers.ModelSerializer):
    project = ProjectListSerializer(read_only=True)
    task = TaskListSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'message', 'project', 'task', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']

class ActivityLogSerializer(serializers.ModelSerializer):
    actor = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = ['id', 'actor', 'verb', 'target_type', 'target_id', 'meta', 'created_at']

class WorkloadSerializer(serializers.Serializer):
    assignee = UserBasicSerializer(read_only=True)
    assignee_id = serializers.UUIDField()
    open_tasks = serializers.IntegerField()