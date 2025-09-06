from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, ProjectMember, Task, TaskStatusHistory, Comment, Notification, Attachment, ActivityLog

User = get_user_model()

class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "full_name", "email"]

class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source="user", write_only=True)
    class Meta:
        model = ProjectMember
        fields = ["id", "user", "user_id", "role", "joined_at"]

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserLiteSerializer(read_only=True)
    members = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ["id","name","description","owner","is_archived","created_at","updated_at","members"]
        read_only_fields = ["owner","created_at","updated_at"]
    def get_members(self, obj):
        qs = obj.memberships.select_related("user").all()
        return ProjectMemberSerializer(qs, many=True).data
    def create(self, validated_data):
        user = self.context["request"].user
        project = Project.objects.create(owner=user, **validated_data)
        ProjectMember.objects.create(project=project, user=user, role="admin")
        return project

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserLiteSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source="assignee", allow_null=True, required=False, write_only=True)
    reporter = UserLiteSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source="project", write_only=True)
    class Meta:
        model = Task
        fields = ["id","project_id","title","description","status","priority","assignee","assignee_id","reporter","due_date","order","created_at","updated_at"]
        read_only_fields = ["reporter","created_at","updated_at"]
    def create(self, validated_data):
        validated_data["reporter"] = self.context["request"].user
        return super().create(validated_data)

class CommentSerializer(serializers.ModelSerializer):
    author = UserLiteSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source="project", write_only=True)
    task_id = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all(), source="task", allow_null=True, required=False, write_only=True)
    parent_id = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), source="parent", allow_null=True, required=False, write_only=True)
    class Meta:
        model = Comment
        fields = ["id","project_id","task_id","author","parent_id","body","created_at","updated_at"]
        read_only_fields = ["author","created_at","updated_at"]
    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id","type","project","task","comment","is_read","created_at"]

class ActivitySerializer(serializers.ModelSerializer):
    actor = UserLiteSerializer(read_only=True)
    class Meta:
        model = ActivityLog
        fields = ["id","project","actor","verb","target_type","target_id","meta","created_at"]
